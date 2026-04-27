import { GET } from './route';
import { getToken } from 'next-auth/jwt';
import { Octokit } from 'octokit';
import { JWT } from 'next-auth/jwt';

// Mock next-auth/jwt
jest.mock('next-auth/jwt');

// Mock octokit
jest.mock('octokit');

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockOctokit = Octokit as jest.MockedClass<typeof Octokit>;

// Define types for our mocks
interface MockOctokitInstance {
  rest: {
    repos: {
      listForAuthenticatedUser: jest.Mock;
    };
  };
}

interface MockRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
  };
  html_url: string;
  description: string;
  private: boolean;
}

describe('GET /api/v1/repos', () => {
  let mockRequest: Request;
  let mockOctokitInstance: MockOctokitInstance;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock request
    mockRequest = new Request('http://localhost:3000/api/v1/repos');

    // Create mock Octokit instance
    mockOctokitInstance = {
      rest: {
        repos: {
          listForAuthenticatedUser: jest.fn(),
        },
      },
    };

    // Mock Octokit constructor to return our mock instance
    mockOctokit.mockImplementation(() => mockOctokitInstance as unknown as Octokit);
  });

  describe('Authentication', () => {
    it('should return 401 when token is null', async () => {
      mockGetToken.mockResolvedValue(null);

      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
      expect(mockGetToken).toHaveBeenCalledWith({
        req: mockRequest,
        secret: 'test-secret',
        cookieName: 'authjs.session-token',
      });
    });

    it('should return 401 when accessToken is undefined', async () => {
      const mockToken: JWT = {
        githubId: '12345',
        githubLogin: 'testuser',
      };

      mockGetToken.mockResolvedValue(mockToken);

      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
    });

    it('should return 401 when accessToken is null', async () => {
      const mockToken: JWT = {
        accessToken: undefined,
        githubId: '12345',
        githubLogin: 'testuser',
      };

      mockGetToken.mockResolvedValue(mockToken);

      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
    });

    it('should return 401 when githubId is null', async () => {
      const mockToken: JWT = {
        accessToken: 'valid-token',
        githubId: null,
        githubLogin: 'testuser',
      };

      mockGetToken.mockResolvedValue(mockToken);

      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
    });

    it('should return 401 when githubId is undefined', async () => {
      const mockToken: JWT = {
        accessToken: 'valid-token',
        githubLogin: 'testuser',
      };

      mockGetToken.mockResolvedValue(mockToken);

      const response = await GET(mockRequest);

      expect(response.status).toBe(401);
    });
  });

  describe('Successful requests', () => {
    beforeEach(() => {
      // Mock valid token
      const mockToken: JWT = {
        accessToken: 'valid-token',
        githubId: '12345',
        githubLogin: 'testuser',
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };

      mockGetToken.mockResolvedValue(mockToken);
    });

    it('should return 200 with repos when authenticated', async () => {
      const mockRepos: MockRepo[] = [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          owner: {
            login: 'user',
            id: 123,
          },
          html_url: 'https://github.com/user/test-repo',
          description: 'Test repository',
          private: false,
        },
      ];

      mockOctokitInstance.rest.repos.listForAuthenticatedUser.mockResolvedValue({
        data: mockRepos,
      });

      const response = await GET(mockRequest);

      expect(response.status).toBe(200);
      expect(mockOctokit).toHaveBeenCalledWith({ auth: 'valid-token' });
      expect(
        mockOctokitInstance.rest.repos.listForAuthenticatedUser
      ).toHaveBeenCalled();

      const data: unknown = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter repos using RepoSchema', async () => {
      const mockRepos: MockRepo[] = [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          owner: {
            login: 'user',
            id: 123,
          },
          html_url: 'https://github.com/user/test-repo',
          description: 'Test repository',
          private: false,
          // Extra fields that should be filtered out
          extraField: 'should not appear',
        },
      ];

      mockOctokitInstance.rest.repos.listForAuthenticatedUser.mockResolvedValue({
        data: mockRepos,
      });

      const response = await GET(mockRequest);
      const data = await response.json() as Record<string, unknown>[];

      expect(data[0]).not.toHaveProperty('extraField');
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      const mockToken: JWT = {
        accessToken: 'valid-token',
        githubId: '12345',
        githubLogin: 'testuser',
      };

      mockGetToken.mockResolvedValue(mockToken);
    });

    it('should handle Octokit RequestError with status', async () => {
      const mockError = Object.assign(new Error('Forbidden'), {
        status: 403,
        message: 'Forbidden',
        name: 'RequestError',
      });

      mockOctokitInstance.rest.repos.listForAuthenticatedUser.mockRejectedValue(
        mockError
      );

      const response = await GET(mockRequest);

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toBe('Forbidden');
    });

    it('should return 500 for parsing errors', async () => {
      const mockRepos = [
        {
          // Invalid data that will fail RepoSchema.parse
          id: 'invalid-id', // Should be number
        },
      ];

      mockOctokitInstance.rest.repos.listForAuthenticatedUser.mockResolvedValue({
        data: mockRepos,
      });

      const response = await GET(mockRequest);

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toBe('Server error');
    });

    it('should return 500 for unknown errors', async () => {
      mockOctokitInstance.rest.repos.listForAuthenticatedUser.mockRejectedValue(
        new Error('Unknown error')
      );

      const response = await GET(mockRequest);

      expect(response.status).toBe(500);
    });
  });
});
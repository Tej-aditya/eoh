"""
Backend API Tests for SkillSync AI - Bearer Token Auth
Tests the new Bearer token authentication flow (replacing cookie-based auth)
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@skillsync.ai"
ADMIN_PASSWORD = "Admin@123"

class TestHealthCheck:
    """Basic API health check"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root returns: {data}")


class TestAuthLogin:
    """Test login endpoint - returns tokens in JSON body"""
    
    def test_login_success_returns_tokens(self):
        """POST /api/auth/login - returns access_token and refresh_token in JSON body"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        # Verify tokens are in JSON body (not cookies)
        assert "access_token" in data, "access_token missing from response"
        assert "refresh_token" in data, "refresh_token missing from response"
        assert "user_id" in data, "user_id missing from response"
        assert "email" in data, "email missing from response"
        
        # Verify token format (JWT)
        assert data["access_token"].count('.') == 2, "access_token is not valid JWT format"
        assert data["refresh_token"].count('.') == 2, "refresh_token is not valid JWT format"
        
        print(f"✓ Login returns tokens in JSON body")
        print(f"  - access_token: {data['access_token'][:50]}...")
        print(f"  - refresh_token: {data['refresh_token'][:50]}...")
        print(f"  - user_id: {data['user_id']}")
        print(f"  - email: {data['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Invalid credentials returns 401")
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent email returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "SomePassword123"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Non-existent user returns 401")


class TestAuthRegister:
    """Test registration endpoint"""
    
    def test_register_success_returns_tokens(self):
        """POST /api/auth/register - creates new user and returns tokens in JSON body"""
        unique_email = f"test_register_{int(time.time())}@test.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "TestPass123!",
            "name": "Test Register User"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        
        data = response.json()
        # Verify tokens are in JSON body
        assert "access_token" in data, "access_token missing from response"
        assert "refresh_token" in data, "refresh_token missing from response"
        assert "user_id" in data, "user_id missing from response"
        assert data["email"] == unique_email, "Email mismatch"
        assert data["name"] == "Test Register User", "Name mismatch"
        
        print(f"✓ Registration returns tokens in JSON body")
        print(f"  - New user: {unique_email}")
    
    def test_register_duplicate_email_returns_400(self):
        """POST /api/auth/register - returns 400 for duplicate email (not 500)"""
        # Try to register with existing admin email
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": ADMIN_EMAIL,
            "password": "SomePassword123!",
            "name": "Duplicate User"
        })
        # Should return 400 Bad Request, not 500 Internal Server Error
        assert response.status_code == 400, f"Expected 400 for duplicate email, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "detail" in data, "Error detail missing"
        print(f"✓ Duplicate email returns 400: {data.get('detail')}")


class TestAuthMe:
    """Test /api/auth/me endpoint with Bearer token"""
    
    @pytest.fixture
    def access_token(self):
        """Get access token via login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_me_with_bearer_token(self, access_token):
        """GET /api/auth/me - returns user info with Bearer token in Authorization header"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == 200, f"Get me failed: {response.text}"
        
        data = response.json()
        assert "user_id" in data, "user_id missing"
        assert "email" in data, "email missing"
        assert data["email"] == ADMIN_EMAIL, f"Email mismatch: {data['email']}"
        
        print(f"✓ GET /api/auth/me with Bearer token works")
        print(f"  - user_id: {data['user_id']}")
        print(f"  - email: {data['email']}")
    
    def test_get_me_without_token_returns_401(self):
        """GET /api/auth/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ GET /api/auth/me without token returns 401")
    
    def test_get_me_with_invalid_token_returns_401(self):
        """GET /api/auth/me with invalid token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ GET /api/auth/me with invalid token returns 401")


class TestAuthLogout:
    """Test logout endpoint"""
    
    def test_logout_returns_success(self):
        """POST /api/auth/logout - returns success message"""
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200, f"Logout failed: {response.text}"
        
        data = response.json()
        assert "message" in data, "Message missing from logout response"
        print(f"✓ Logout returns: {data}")


class TestDashboardWithAuth:
    """Test dashboard endpoints require Bearer token"""
    
    @pytest.fixture
    def access_token(self):
        """Get access token via login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_dashboard_stats_with_token(self, access_token):
        """GET /api/dashboard/stats with Bearer token"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/stats",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == 200, f"Dashboard stats failed: {response.text}"
        
        data = response.json()
        assert "total_analyses" in data
        assert "total_simulations" in data
        print(f"✓ Dashboard stats with Bearer token works")
    
    def test_dashboard_stats_without_token_returns_401(self):
        """GET /api/dashboard/stats without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Dashboard stats without token returns 401")


class TestProfileWithAuth:
    """Test profile endpoints require Bearer token"""
    
    @pytest.fixture
    def access_token(self):
        """Get access token via login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_profile_with_token(self, access_token):
        """GET /api/profile with Bearer token"""
        response = requests.get(
            f"{BASE_URL}/api/profile",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == 200, f"Get profile failed: {response.text}"
        
        data = response.json()
        assert "email" in data
        print(f"✓ GET /api/profile with Bearer token works")
    
    def test_get_profile_without_token_returns_401(self):
        """GET /api/profile without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/profile")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ GET /api/profile without token returns 401")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

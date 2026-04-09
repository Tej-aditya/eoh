import requests
import sys
import json
import time
from datetime import datetime

class SkillSyncAPITester:
    def __init__(self, base_url="https://gap-bridge-learn.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.analysis_data = None
        self.simulation_task = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {}
        
        if files is None:
            headers['Content-Type'] = 'application/json'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, timeout=timeout)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=timeout)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_resume_upload(self):
        """Test resume upload with a sample PDF"""
        print("\n📄 Testing Resume Upload...")
        
        # Create a simple PDF-like content for testing
        # Note: This is a mock test since we don't have a real PDF file
        sample_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Sample Resume Text) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n299\n%%EOF"
        
        files = {'file': ('test_resume.pdf', sample_pdf_content, 'application/pdf')}
        
        success, response = self.run_test(
            "Resume Upload", 
            "POST", 
            "upload-resume", 
            200, 
            files=files,
            timeout=15
        )
        
        if success and isinstance(response, dict) and 'resume_text' in response:
            print(f"   ✅ Resume text extracted: {len(response['resume_text'])} characters")
            return True, response['resume_text']
        else:
            print(f"   ❌ Resume upload failed or no text extracted")
            return False, ""

    def test_job_scraping(self):
        """Test job description scraping"""
        print("\n🌐 Testing Job Scraping...")
        
        # Test with a simple URL (using a public site that should work)
        test_data = {
            "url": "https://httpbin.org/html"  # Simple HTML page for testing
        }
        
        success, response = self.run_test(
            "Job Scraping",
            "POST",
            "scrape-job",
            200,
            data=test_data,
            timeout=15
        )
        
        if success and isinstance(response, dict):
            job_title = response.get('job_title', '')
            description = response.get('description', '')
            print(f"   ✅ Job title: {job_title}")
            print(f"   ✅ Description length: {len(description)} characters")
            return True, response
        else:
            print(f"   ❌ Job scraping failed")
            return False, {}

    def test_gap_analysis(self, resume_text="", job_description=""):
        """Test AI gap analysis"""
        print("\n🤖 Testing AI Gap Analysis...")
        
        # Use sample data if not provided
        if not resume_text:
            resume_text = "Software Engineer with 3 years experience in Python, JavaScript, and React. Worked on web applications and APIs. Bachelor's degree in Computer Science."
        
        if not job_description:
            job_description = "Senior Full Stack Developer position requiring expertise in Python, React, Node.js, Docker, Kubernetes, and cloud platforms. 5+ years experience required. Must have experience with microservices architecture and DevOps practices."
        
        test_data = {
            "resume_text": resume_text,
            "job_description": job_description,
            "job_title": "Senior Full Stack Developer"
        }
        
        success, response = self.run_test(
            "AI Gap Analysis",
            "POST",
            "analyze-gap",
            200,
            data=test_data,
            timeout=45  # AI analysis might take longer
        )
        
        if success and isinstance(response, dict):
            self.analysis_data = response
            print(f"   ✅ Readiness Score: {response.get('readiness_score', 'N/A')}")
            print(f"   ✅ Job Title: {response.get('job_title', 'N/A')}")
            print(f"   ✅ Missing Skills: {len(response.get('missing_skills', []))}")
            print(f"   ✅ Strengths: {len(response.get('strengths', []))}")
            return True, response
        else:
            print(f"   ❌ Gap analysis failed")
            return False, {}

    def test_simulation_generation(self):
        """Test simulation task generation"""
        print("\n🎮 Testing Simulation Generation...")
        
        if not self.analysis_data or not self.analysis_data.get('missing_skills'):
            print("   ⚠️  No analysis data available, using sample skill")
            skill_data = {
                "skill_name": "Docker",
                "importance": "High",
                "description": "Containerization technology for application deployment"
            }
        else:
            skill_data = self.analysis_data['missing_skills'][0]
        
        success, response = self.run_test(
            "Simulation Generation",
            "POST",
            "simulation/generate",
            200,
            data=skill_data,
            timeout=45  # AI generation might take longer
        )
        
        if success and isinstance(response, dict):
            self.simulation_task = response
            print(f"   ✅ Task Type: {response.get('task_type', 'N/A')}")
            print(f"   ✅ Title: {response.get('title', 'N/A')}")
            print(f"   ✅ Task ID: {response.get('id', 'N/A')}")
            return True, response
        else:
            print(f"   ❌ Simulation generation failed")
            return False, {}

    def test_simulation_validation(self):
        """Test simulation answer validation"""
        print("\n✅ Testing Simulation Validation...")
        
        if not self.simulation_task:
            print("   ⚠️  No simulation task available, skipping validation test")
            return False, {}
        
        # Provide a sample answer based on task type
        if self.simulation_task.get('task_type') == 'code':
            user_answer = "def solution():\n    return 'sample solution'"
        else:
            user_answer = "A"  # Sample multiple choice answer
        
        test_data = {
            "task_id": self.simulation_task['id'],
            "user_answer": user_answer
        }
        
        success, response = self.run_test(
            "Simulation Validation",
            "POST",
            "simulation/validate",
            200,
            data=test_data,
            timeout=30
        )
        
        if success and isinstance(response, dict):
            print(f"   ✅ Is Correct: {response.get('is_correct', 'N/A')}")
            print(f"   ✅ Score Improvement: {response.get('score_improvement', 'N/A')}")
            print(f"   ✅ Feedback: {response.get('feedback', 'N/A')[:100]}...")
            return True, response
        else:
            print(f"   ❌ Simulation validation failed")
            return False, {}

def main():
    print("🚀 Starting SkillSync AI Backend API Tests")
    print("=" * 50)
    
    tester = SkillSyncAPITester()
    
    # Test sequence
    print("\n📋 Test Sequence:")
    print("1. Root API endpoint")
    print("2. Resume upload")
    print("3. Job description scraping")
    print("4. AI gap analysis")
    print("5. Simulation generation")
    print("6. Simulation validation")
    
    # Run tests
    tester.test_root_endpoint()
    
    resume_success, resume_text = tester.test_resume_upload()
    
    job_success, job_data = tester.test_job_scraping()
    job_description = job_data.get('description', '') if job_success else ''
    
    analysis_success, analysis_data = tester.test_gap_analysis(resume_text, job_description)
    
    simulation_success, simulation_data = tester.test_simulation_generation()
    
    validation_success, validation_data = tester.test_simulation_validation()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the logs above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
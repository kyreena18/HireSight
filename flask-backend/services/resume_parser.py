"""
Resume Parser Service
Extracts information from PDF and DOCX resumes using NLP
"""

import re
import os
from PyPDF2 import PdfReader
from docx import Document
import spacy
from collections import Counter


class ResumeParser:
    """Resume parsing and entity extraction"""

    def __init__(self):
        """Initialize NLP models"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            print("Warning: spaCy model not loaded. Run: python -m spacy download en_core_web_sm")
            self.nlp = None

        # Common skills database (expand this list)
        self.SKILLS_DB = [
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'go', 'rust', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash', 'powershell',

            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
            'spring', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'sass', 'webpack', 'vite',

            # Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
            'oracle', 'sqlite', 'dynamodb', 'firebase', 'supabase',

            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform',
            'ansible', 'git', 'github', 'gitlab', 'bitbucket', 'linux', 'nginx', 'apache',

            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
            'pandas', 'numpy', 'data analysis', 'data science', 'nlp', 'computer vision', 'ai',

            # Mobile Development
            'ios', 'android', 'react native', 'flutter', 'xamarin', 'swift', 'objective-c',

            # Other Technologies
            'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'jira', 'confluence',
            'testing', 'unit testing', 'integration testing', 'selenium', 'jest', 'pytest',
        ]

    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error extracting PDF text: {str(e)}")
            raise

    def extract_text_from_docx(self, file_path):
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            print(f"Error extracting DOCX text: {str(e)}")
            raise

    def extract_email(self, text):
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else None

    def extract_phone(self, text):
        """Extract phone number from text"""
        # Matches various phone formats
        phone_patterns = [
            r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        ]
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                return phones[0]
        return None

    def extract_skills(self, text):
        """Extract skills from text"""
        text_lower = text.lower()
        found_skills = []

        for skill in self.SKILLS_DB:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                # Capitalize properly
                found_skills.append(skill.title())

        # Remove duplicates while preserving order
        unique_skills = []
        seen = set()
        for skill in found_skills:
            if skill.lower() not in seen:
                unique_skills.append(skill)
                seen.add(skill.lower())

        return unique_skills

    def extract_experience(self, text):
        """Extract work experience entries"""
        experiences = []

        # Patterns for common job titles and companies
        job_patterns = [
            r'(Senior|Junior|Lead|Staff)?\s*(Developer|Engineer|Manager|Designer|Analyst|Scientist|Consultant|Architect)',
            r'(Software|Data|Systems|Network|Database|Frontend|Backend|Full Stack|DevOps)',
        ]

        # Try to find experience sections
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower()
            # Look for experience indicators
            if any(word in line_lower for word in ['experience', 'employment', 'work history', 'professional']):
                # Extract next 10 lines as potential experience entries
                for j in range(i+1, min(i+11, len(lines))):
                    exp_line = lines[j].strip()
                    if len(exp_line) > 10 and any(re.search(pattern, exp_line, re.IGNORECASE) for pattern in job_patterns):
                        experiences.append(exp_line)

        return experiences[:5]  # Return top 5 experiences

    def extract_education(self, text):
        """Extract education entries"""
        education = []

        degrees = [
            'bachelor', 'master', 'phd', 'doctorate', 'mba', 'bs', 'ba', 'ms', 'ma',
            'b.tech', 'm.tech', 'b.e', 'm.e', 'bsc', 'msc', 'associate', 'diploma'
        ]

        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(degree in line_lower for degree in degrees):
                education.append(line.strip())

        return education[:3]  # Return top 3 education entries

    def calculate_years_of_experience(self, text):
        """Estimate years of experience from text"""
        # Look for patterns like "5 years", "3+ years", etc.
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience:\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s+(?:in|as|with)',
        ]

        max_years = 0
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                years = int(match)
                if years > max_years and years < 50:  # Sanity check
                    max_years = years

        # If no explicit mention, try to count date ranges
        if max_years == 0:
            # Look for date ranges like "2018-2023" or "Jan 2020 - Present"
            date_ranges = re.findall(r'(20\d{2})\s*[-–]\s*(?:(20\d{2})|present|current)', text, re.IGNORECASE)
            if date_ranges:
                total_years = 0
                current_year = 2026  # Update this
                for start, end in date_ranges:
                    start_year = int(start)
                    end_year = int(end) if end else current_year
                    total_years += (end_year - start_year)
                max_years = min(total_years, 30)  # Cap at 30 years

        return max_years

    def clean_text(self, text):
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s@.+\-(),]', '', text)
        return text.strip()

    def parse_resume(self, file_path, file_type):
        """
        Main function to parse a resume

        Args:
            file_path: Path to the resume file
            file_type: Type of file (pdf or docx)

        Returns:
            Dictionary containing parsed data
        """
        try:
            # Extract text based on file type
            if file_type.lower() == 'pdf':
                raw_text = self.extract_text_from_pdf(file_path)
            elif file_type.lower() in ['docx', 'doc']:
                raw_text = self.extract_text_from_docx(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")

            if not raw_text:
                raise ValueError("No text could be extracted from the file")

            # Clean text
            cleaned_text = self.clean_text(raw_text)

            # Extract entities
            email = self.extract_email(raw_text)
            phone = self.extract_phone(raw_text)
            skills = self.extract_skills(raw_text)
            experience = self.extract_experience(raw_text)
            education = self.extract_education(raw_text)
            years_of_experience = self.calculate_years_of_experience(raw_text)

            # Build result
            result = {
                'raw_text': raw_text,
                'cleaned_text': cleaned_text,
                'entities': {
                    'email': email,
                    'phone': phone,
                    'skills': skills,
                    'experience': experience,
                    'education': education,
                    'years_of_experience': years_of_experience,
                }
            }

            return result

        except Exception as e:
            print(f"Error parsing resume: {str(e)}")
            raise


# Global parser instance
resume_parser = ResumeParser()

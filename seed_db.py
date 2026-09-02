from app import app, db, Placement, PlacementPerson, InterviewExperience, InterviewQuestion, User
import random
from datetime import datetime, timedelta

def seed_database():
    with app.app_context():
        # Ensure we have a default user to attribute these to
        user = User.query.first()
        if not user:
            user = User(username='testuser', email='test@test.com')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            print("Created default user.")

        username = user.username

        companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Atlassian', 'Goldman Sachs', 'Morgan Stanley', 'Adobe', 'Oracle']
        roles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Machine Learning Engineer']
        years = ['2023', '2024', '2025', '2026']
        names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Mallory', 'Nina', 'Oscar', 'Peggy', 'Trent', 'Victor', 'Walter']
        
        # 1. Add Placements
        print("Seeding Placements...")
        for _ in range(30):
            p = Placement(
                company=random.choice(companies),
                type=random.choice(['Internship', 'Placement']),
                mode=random.choice(['On Campus', 'Off Campus']),
                year=random.choice(years),
                role=random.choice(roles),
                referral=random.choice(['Yes', 'No']),
                created_by=username
            )
            db.session.add(p)
            db.session.flush() # Get the ID
            
            # Add 1 to 3 people for this placement
            num_people = random.randint(1, 3)
            for _ in range(num_people):
                person = PlacementPerson(
                    placement_id=p.id,
                    name=random.choice(names)
                )
                db.session.add(person)
                
        # 2. Add Interview Experiences
        print("Seeding Interview Experiences...")
        interview_tips = [
            "Focus heavily on Graph and DP problems.",
            "Make sure you understand System Design basics.",
            "Be prepared for behavioral questions (Leadership Principles).",
            "Communication is key. Always think out loud.",
            "Practice SQL and database normalization.",
            "Know your resume inside out.",
            "Review Object Oriented Programming concepts.",
            "Don't rush to code. Clarify the problem first."
        ]
        
        technical_questions = [
            ("Reverse a linked list", "Used an iterative approach with three pointers (prev, curr, next)."),
            ("Two Sum", "Used a hash map to store complements, O(n) time complexity."),
            ("System Design: TinyURL", "Discussed hashing, database sharding, and load balancers."),
            ("Find the longest palindromic substring", "Used expand around center approach, O(n^2) time."),
            ("SQL: Find nth highest salary", "Used DENSE_RANK() window function."),
            ("Explain the difference between a process and a thread", "Process is a program in execution, thread is a lightweight process."),
            ("Detect cycle in a directed graph", "Used DFS with a recursion stack array to keep track of visited nodes in the current path.")
        ]
        
        behavioral_questions = [
            ("Tell me about a time you failed.", "I talked about a project where we missed a deadline due to scope creep, and how we fixed it using Agile."),
            ("Why do you want to join this company?", "I mentioned their recent work in AI and how it aligns with my interests."),
            ("Describe a conflict with a teammate.", "I explained how we resolved a technical disagreement by prototyping both solutions.")
        ]

        for _ in range(25):
            ie = InterviewExperience(
                company=random.choice(companies),
                candidate_name=random.choice(names),
                interviewer_name=f"Mr. {random.choice(names)}",
                year=random.choice(years),
                type=random.choice(['Internship', 'Placement']),
                tips=random.choice(interview_tips),
                created_by=username,
                tags="DSA,System Design,Behavioral"
            )
            db.session.add(ie)
            db.session.flush()
            
            # Add 2 to 4 questions per interview
            num_questions = random.randint(2, 4)
            questions_pool = technical_questions + behavioral_questions
            selected_qs = random.sample(questions_pool, num_questions)
            
            for q, a in selected_qs:
                iq = InterviewQuestion(
                    interview_id=ie.id,
                    question=q,
                    answer=a
                )
                db.session.add(iq)

        db.session.commit()
        print("Successfully seeded database with 30 Placements and 25 Interview Experiences!")

if __name__ == '__main__':
    seed_database()

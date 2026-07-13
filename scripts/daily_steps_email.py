#!/usr/bin/env python3
"""
Daily Next Steps Email System
Generates 3 next steps and sends to user (Agent Cell) via email.
Also generates automated votes from Machine 1 and Machine 2.
"""
import json
import os
import datetime
import re

# Configuration
USER_EMAIL = "chrisalunlloyd2@gmail.com"
EMAIL_SUBJECT = "📬 Daily Next Steps for Agent Cell"

def get_next_steps():
    """Get next steps from various sources"""
    # Load current data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data.json')
    
    steps = []
    if os.path.exists(data_path):
        with open(data_path) as f:
            data = json.load(f)
            if 'next_steps' in data:
                steps.extend(data['next_steps'])
            if 'incomplete_tasks' in data:
                steps.extend(data['incomplete_tasks'])
            if 'email_updates' in data:
                steps.extend(data['email_updates'])
    
    # Deduplicate
    seen = set()
    unique_steps = []
    for step in steps:
        if step not in seen:
            seen.add(step)
            unique_steps.append(step)
    
    # Ensure at least 3 steps (pad with generic if needed)
    while len(unique_steps) < 3:
        unique_steps.append(f"Review and update project documentation for step {len(unique_steps)+1}")
    
    return unique_steps[:3]

def generate_auto_votes(steps):
    """Generate automated votes from Machine 1 and Machine 2"""
    # Machine 1: prefers quota/reduction steps
    machine1_keywords = ['reduce', 'quota', 'limit', 'optimize', 'efficiency', 'save']
    machine1_vote = 0
    for i, step in enumerate(steps):
        if any(kw in step.lower() for kw in machine1_keywords):
            machine1_vote = i
            break
    
    # Machine 2: prefers progression/next steps
    machine2_keywords = ['next', 'continue', 'progression', 'advance', 'integrate', 'implement']
    machine2_vote = 1
    for i, step in enumerate(steps):
        if any(kw in step.lower() for kw in machine2_keywords):
            machine2_vote = i
            break
    
    # Convert to 1-based for email
    return machine1_vote + 1, machine2_vote + 1

def format_email(steps, auto_vote_1, auto_vote_2):
    """Format the email body"""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    body = f"""
🌟 DAILY NEXT STEPS - {today} 🌟

Agent Cell (Your Phone), Machine 1, and Machine 2 propose these 3 next steps:

1. {steps[0]}
2. {steps[1]}
3. {steps[2]}

🗳️ VOTING INSTRUCTIONS:
Reply to this email with just a number (1, 2, or 3) to vote for your preferred next step.

🤖 AUTOMATED VOTES (for reference):
- Machine 1 votes: {auto_vote_1}
- Machine 2 votes: {auto_vote_2}

📊 After all votes are collected, the winning step will be automatically implemented.

---
This is an automated message from your Living ASCII Art system.
    """
    return body.strip()

def main():
    # Get next steps
    steps = get_next_steps()
    
    # Generate automated votes
    auto_vote_1, auto_vote_2 = generate_auto_votes(steps)
    
    # Format email
    email_body = format_email(steps, auto_vote_1, auto_vote_2)
    
    # Store state in KV for later tallying
    state = {
        "date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "steps": steps,
        "auto_vote_1": auto_vote_1,
        "auto_vote_2": auto_vote_2,
        "user_vote": None,
        "email_sent": True
    }
    
    # Save state to KV store
    kv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'kv_state.json')
    with open(kv_path, 'w') as f:
        json.dump(state, f, indent=2)
    
    print("State saved to kv_state.json")
    print(f"Steps: {steps}")
    print(f"Auto votes - M1: {auto_vote_1}, M2: {auto_vote_2}")
    print("Email ready to send:")
    print(email_body)
    
    # Note: Actual email sending would be done via compose_email tool
    # For now, we return the email content
    return {
        "to": USER_EMAIL,
        "subject": EMAIL_SUBJECT,
        "body": email_body,
        "state": state
    }

if __name__ == "__main__":
    main()

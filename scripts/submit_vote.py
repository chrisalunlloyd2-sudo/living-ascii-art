"""
Submit a [VOTE] email to the Aegis Agent Bridge.
Used by living-ascii-art Daily Flex voting.
"""
import os
import sys
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime, timezone


def build_vote_email(voter_id: str, choice: str, timestamp: str) -> str:
    subject = "[AGENT:aegis][TASK:vote][VOTE] Daily Flex vote"
    body = f"""From: {voter_id}
Timestamp: {timestamp}
Vote: {choice}

[VOTE] choice={choice} voter={voter_id} context=daily_flex
[DONE] false
"""
    return subject, body


def send_vote(choice: str, voter_id: str = "dashboard_anonymous"):
    user = os.environ.get("AEGIS_EMAIL")
    password = os.environ.get("AEGIS_PASSWORD")
    if not user or not password:
        raise RuntimeError("AEGIS_EMAIL and AEGIS_PASSWORD must be set")

    ts = datetime.now(timezone.utc).isoformat()
    subject, body = build_vote_email(voter_id, choice, ts)

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = user
    msg["To"] = user
    msg.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(user, password)
        server.send_message(msg)

    print(f"Sent vote email: choice={choice} at {ts}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: submit_vote.py <choice> [voter_id]")
        sys.exit(1)
    choice = sys.argv[1]
    voter = sys.argv[2] if len(sys.argv) > 2 else "dashboard_anonymous"
    send_vote(choice, voter)

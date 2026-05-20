from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, Integer
import random

from app.database.dependencies import get_db
from app.models.attempt_model import Attempt
from app.models.problem_model import Problem
from app.models.topic_model import Topic
from app.models.user_model import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# weak topics
@router.get("/weak-topics")
def get_weak_topics(db: Session = Depends(get_db)):
    
    results = (
        db.query(
            Topic.name,
            func.count(Attempt.id).label("total"),
            func.sum(func.cast(Attempt.is_solved, Integer)).label("solved")
        )
        .join(Problem, Problem.topic_id == Topic.id)
        .join(Attempt, Attempt.problem_id == Problem.id)
        .group_by(Topic.name)
        .all()
    )

    output = []

    for topic, total, solved in results:
        accuracy = (solved / total) * 100 if total > 0 else 0

        if accuracy < 60:
            output.append({
                "topic": topic,
                "accuracy": round(accuracy, 2)
            })

    return output

#strong topics
@router.get("/strong-topics")
def get_strong_topics(db: Session = Depends(get_db)):

    results = (
        db.query(
            Topic.name,
            func.count(Attempt.id).label("total"),
            func.sum(func.cast(Attempt.is_solved, Integer)).label("solved")
        )
        .join(Problem, Problem.topic_id == Topic.id)
        .join(Attempt, Attempt.problem_id == Problem.id)
        .group_by(Topic.id, Topic.name)
        .all()
    )

    output = []
    for topic, total, solved in results:
        accuracy = (solved / total) * 100 if total > 0 else 0

        if accuracy >= 60:
            output.append(
                {
                    "topic" : topic,
                    "accuracy" : round(accuracy, 2)
                }
            )

        #key difference
    output.sort(key=lambda x: x["accuracy"], reverse=True)
    return output
    

# overall stats
@router.get("/overall-stats")
def get_overall_stats(db: Session = Depends(get_db)):
    
    total_attempts = db.query(Attempt).count()

    total_solved = db.query(Attempt).filter(Attempt.is_solved == True).count()

    accuracy = (total_solved / total_attempts) * 100 if total_attempts > 0 else 0

    return {
        "total_attempts": total_attempts,
        "total_solved": total_solved,
        "accuracy": round(accuracy, 2)
    }

#recommendatations
@router.get("/recommendation")
def get_recommendation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    unsolved_problems = (
        db.query(Problem)
        .filter(
            Problem.user_id == current_user.id,
            Problem.is_solved == False
        )
        .all()
    )

    if unsolved_problems:
        selected = random.choice(unsolved_problems)

    else:
        all_problems = (
            db.query(Problem)
            .filter(Problem.user_id == current_user.id)
            .all()
        )

        if not all_problems:
            return {"message": "No problems available"}

        selected = random.choice(all_problems)

    return {
        "id": selected.id,
        "title": selected.title,
        "difficulty": selected.difficulty,
        "link": selected.link,
    }

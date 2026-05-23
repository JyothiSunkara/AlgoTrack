from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import random

from app.database.dependencies import get_db
from app.models.problem_model import Problem
from app.models.user_model import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

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

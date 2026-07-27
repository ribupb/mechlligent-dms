from models import db
from datetime import datetime


class DatasetEntry(db.Model):

    __tablename__ = "dataset_entries"
    
    STATUS_DRAFT = "Draft"
    STATUS_SUBMITTED = "Submitted for Review"
    STATUS_CORRECTIONS = "Corrections Requested"
    STATUS_APPROVED = "Approved"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    row_number = db.Column(
        db.Integer,
        nullable=False
    )

    topic_id = db.Column(
        db.String(50),
        nullable=False
    )

    practice_question_id = db.Column(
        db.String(50),
        nullable=False
    )
    
    topic_en = db.Column(db.String(200))
    topic_ml = db.Column(db.String(200))

    sub_topic_en = db.Column(db.String(200))
    sub_topic_ml = db.Column(db.String(200))
    scenario_en = db.Column(
        db.Text
    )

    scenario_explanation_en = db.Column(
        db.Text
    )

    memory_shortcut_en = db.Column(
        db.Text
    )

    applies_when_en = db.Column(
        db.Text
    )

    not_applies_when_en = db.Column(
        db.Text
    )
    
    question_en = db.Column(
    db.Text
    )

    option_a_en = db.Column(
        db.Text
    )

    option_b_en = db.Column(
        db.Text
    )

    option_c_en = db.Column(
        db.Text
    )

    correct_answer_letter = db.Column(
        db.String(5)
    )

    correct_answer_en = db.Column(
        db.Text
    )

    explanation_en = db.Column(
        db.Text
    )

    wrong_answer_tip_en = db.Column(
        db.Text
    )

    question_image_ref = db.Column(
        db.String(200)
    )
    
    scenario_ml = db.Column(
    db.Text
    )

    scenario_explanation_ml = db.Column(
        db.Text
    )

    memory_shortcut_ml = db.Column(
        db.Text
    )

    applies_when_ml = db.Column(
        db.Text
    )

    not_applies_when_ml = db.Column(
        db.Text
    )

    question_ml = db.Column(
        db.Text
    )

    question_en_rich = db.Column(db.Text, nullable=True)
    question_ml_rich = db.Column(db.Text, nullable=True)
    
    rich_content = db.Column(db.JSON, nullable=True)


    option_a_ml = db.Column(
        db.Text
    )

    option_b_ml = db.Column(
        db.Text
    )

    option_c_ml = db.Column(
        db.Text
    )

    correct_answer_ml = db.Column(
        db.Text
    )

    explanation_ml = db.Column(
        db.Text
    )

    wrong_answer_tip_ml = db.Column(
        db.Text
    )
    
    english_completed = db.Column(
    db.Boolean,
    default=False,
    nullable=False
    )
    
    
    status = db.Column(
        db.String(30),
        nullable=False,
        default=STATUS_DRAFT
    )
    malayalam_completed = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    has_correction = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    correction_note = db.Column(
        db.Text
    )
    
    attempted = db.Column(db.Boolean, default=False)
    
    is_new = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )
    
    created_at = db.Column(
    db.DateTime,
    default=datetime.utcnow,
    nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    submitted_at = db.Column(
        db.DateTime,
        nullable=True
    )

    approved_at = db.Column(
        db.DateTime,
        nullable=True
    )
        
    def get_rich(self, field_name):
        if self.rich_content and field_name in self.rich_content:
            return self.rich_content[field_name]

        return getattr(self, field_name, "") or ""
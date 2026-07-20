import os
from openpyxl import load_workbook
from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from models.dataset_entry import DatasetEntry
from models import db
from models.project import Project

project = Blueprint("project", __name__)

@project.route("/project/<int:project_id>/dashboard")
def project_dashboard(project_id):

    project = Project.query.get_or_404(project_id)

    return render_template(
        "project_dashboard.html",
        project=project
    )

@project.route("/create-project", methods=["GET", "POST"])
def create_project():

    if request.method == "POST":

        project_name = request.form.get("project_name")

        description = request.form.get("description")

        new_project = Project(
            project_name=project_name,
            description=description
        )

        db.session.add(new_project)

        db.session.commit()

        return redirect(url_for("workspace.workspace_page"))

    return render_template("create_project.html")

@project.route(
    "/project/<int:project_id>/import",
    methods=["GET","POST"]
)
def import_dataset(project_id):

    project = Project.query.get_or_404(project_id)

    if request.method == "POST":

        file = request.files.get("dataset")

        if not file:

            flash(
                "Please select an Excel file.",
                "danger"
            )

            return redirect(request.url)

        filename = "backbone_dataset.xlsx"

        upload_folder = os.path.join(
            "uploads",
            f"project_{project.id}"
        )

        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, filename)

        file.save(file_path)

        # Read the uploaded Excel
        workbook = load_workbook(file_path)

        sheet = workbook.active
        
        # Read column headers (Excel Row 1)
        headers = next(
            sheet.iter_rows(
                min_row=1,
                max_row=1,
                values_only=True
            )
        )

        print("\nHEADERS")
        print(headers)
        
        
        
        # Remember the latest non-empty values
        current_topic_id = None
        current_topic = None
        current_sub_topic = None

        current_scenario = None
        current_concept_image_ref = None
        current_scenario_explanation = None
        current_memory_shortcut = None
        current_applies_when = None
        current_not_applies_when = None
        
        
        
        
       # Read every data row
        for excel_row_number, row in enumerate(
            sheet.iter_rows(min_row=2, values_only=True),
            start=2
        ):

            row_data = {
                header: value
                for header, value in zip(headers, row)
                if header is not None
            }

            print(f"\nEXCEL ROW: {excel_row_number}")
            print(row_data)
            
            
            # Remember latest values if they are not empty

            if row_data["Topic_id"]:
                current_topic_id = row_data["Topic_id"]

            if row_data["Topic"]:
                current_topic = row_data["Topic"]

            if row_data["Sub_topic"]:
                current_sub_topic = row_data["Sub_topic"]

            if row_data["Scenario"]:
                current_scenario = row_data["Scenario"]

            if row_data["Concept_image_ref"]:
                current_concept_image_ref = row_data["Concept_image_ref"]

            if row_data["Scenario_explanation"]:
                current_scenario_explanation = row_data["Scenario_explanation"]

            if row_data["Memory_shortcut"]:
                current_memory_shortcut = row_data["Memory_shortcut"]

            if row_data["Applies_when"]:
                current_applies_when = row_data["Applies_when"]

            if row_data["Not_applies_when"]:
                current_not_applies_when = row_data["Not_applies_when"]
                
                
            print("\nCURRENT VALUES")
            print(current_topic_id)
            print(current_topic)
            print(current_sub_topic)
            
        
        
            entry = DatasetEntry(
                project_id=project.id,
                row_number=excel_row_number,

                topic_id=current_topic_id,
                practice_question_id=row_data["Practice_question_id"],
                topic=current_topic,
                sub_topic=current_sub_topic,

                scenario_en=current_scenario,
                scenario_explanation_en=current_scenario_explanation,
                memory_shortcut_en=current_memory_shortcut,
                applies_when_en=current_applies_when,
                not_applies_when_en=current_not_applies_when,
                

                question_en=row_data["Questions"],
                option_a_en=row_data["Option_A"],
                option_b_en=row_data["Option_B"],
                option_c_en=row_data["Option_C"],

                correct_answer_letter=row_data["Correct_answer_letter"],
                correct_answer_en=row_data["Correct_answer"],

                explanation_en=row_data["Explanation"],
                wrong_answer_tip_en=row_data["Wrong_Answer_Tip"],

                question_image_ref=row_data["Question_image_ref"]
            )
            
            db.session.add(entry)
            print(f"Added: {entry.practice_question_id}")
        
        db.session.commit()

        print("All rows imported successfully!")

 
        

        total_rows = sheet.max_row
        total_columns = sheet.max_column

        print("=" * 50)
        print("Workbook Loaded Successfully")
        print("Sheet Name:", sheet.title)
        print("Rows:", total_rows)
        print("Columns:", total_columns)
        print("=" * 50)

        project.template_excel_path = os.path.join(
            "project_files",
            "uploads",
            f"project_{project.id}",
            filename
        )
        project.status = "Dataset Imported"

        db.session.commit()

        flash(
            "Dataset uploaded successfully!",
            "success"
        )

        return redirect(
            url_for(
                "project.project_dashboard",
                project_id=project.id
            )
        )

    return render_template(
        "import_dataset.html",
        project=project
    )
from pydantic import BaseModel # Importing BaseModel from Pydantic for data validation and settings management


class ScheuledAppointmentDTO(BaseModel):# Defining a data transfer object (DTO) for a scheduled appointment
    """
    This class represents a validation model for the user login form
    """

    doctor_id: int  # ID of the doctor associated with the appointment
    user_id: int  # ID of the user associated with the appointment
    date: str # format: YYYY-MM-DD
    time: str # format: HH:MM

    def to_json(self) -> str: # Method to convert the appointment details to a JSON-compatible dictionary
        return {
            "doctor_id": self.doctor_id, # Adding doctor_id to the dictionary
            "user_id": self.user_id, # Adding user_id to the dictionary
            "date": self.date, # Adding date to the dictionary
            "time": self.time,  # Adding time to the dictionary
        }

from pydantic import BaseModel, Field, field_validator # Importing necessary Pydantic components for data validation
import re # Importing regex module for email validation


class PatientRegisterForm(BaseModel):
    """
    This class represents a validation model for the user login form
    """

    name: str = Field(min_length=2, max_length=50) # Patient's name with constraints on length
    email: str = Field(min_length=5, max_length=50)  # Patient's email with constraints on length
    password: str = Field(min_length=6) # Patient's password with a minimum length

    def to_json(self) -> str:
        return {"name": self.name, "email": self.email, "password": self.password}

    @field_validator("email")
    def email_must_be_valid(cls, email: str) -> None:
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(regex, email):
            raise ValueError("Invalid email address")
        return email


class DoctorEditProfileDto(BaseModel):
    """
    This class represents an edit dto for the doctor model
    """
    profession: str = Field(min_length=2, max_length=50)

    def to_json(self) -> str:
        return {"profession": self.profession}


class DoctorRegisterForm(BaseModel):
    """
    This class represents a validation model for the user login form
    """

    name: str = Field(min_length=2, max_length=50) # Doctor's name with constraints on length
    email: str = Field(min_length=5, max_length=50) # Doctor's email with constraints on length
    password: str = Field(min_length=6) # Doctor's password with a minimum length
    profession: str = Field(min_length=2, max_length=50) # Doctor's profession with constraints on length

    def to_json(self) -> str:
        return {
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "profession": self.profession,
        }

    @field_validator("email")
    def email_must_be_valid(cls, email: str) -> None:
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(regex, email):
            raise ValueError("Invalid email address")
        return email


class UserLoginForm(BaseModel):

    email: str = Field(min_length=5, max_length=50)
    password: str = Field(min_length=6)

    def to_json(self) -> str:
        return {"email": self.email, "password": self.password}

    @field_validator("email")
    def email_must_be_valid(cls, email: str) -> None:
        regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(regex, email):
            raise ValueError("Invalid email address")
        return email

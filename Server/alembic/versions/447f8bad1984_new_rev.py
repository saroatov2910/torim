"""new-rev

Revision ID: 447f8bad1984
Revises: 2cdc6bbafda7
Create Date: 2024-11-14 11:12:08.564785

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '447f8bad1984'
down_revision: Union[str, None] = '2cdc6bbafda7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

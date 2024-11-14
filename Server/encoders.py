from sqlalchemy.orm import class_mapper, ColumnProperty, RelationshipProperty
import json

def serialize(obj, depth=1,ignore: list[str] = []):
    """
    Serializes SQLAlchemy objects up to a specified depth.
    If depth is 0, it serializes only columns and ignores relationships.
    """
    if depth < 0:
        return None  # Stop recursion

    serialized_data = {}
    for prop in class_mapper(obj.__class__).iterate_properties:
        if prop.key in ignore:continue
        if isinstance(prop, ColumnProperty):
            # Include column data
            serialized_data[prop.key] = getattr(obj, prop.key)
        elif isinstance(prop, RelationshipProperty) and depth > 0:
            # Handle relationships up to the specified depth
            related_obj = getattr(obj, prop.key)
            if related_obj is not None:
                if isinstance(related_obj, list):  # For one-to-many relationships
                    serialized_data[prop.key] = [serialize(child, depth - 1) for child in related_obj]
                else:  # For many-to-one or one-to-one relationships
                    serialized_data[prop.key] = serialize(related_obj, depth - 1)
    return serialized_data


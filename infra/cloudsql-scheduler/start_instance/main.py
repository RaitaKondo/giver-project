import os
from googleapiclient.discovery import build

PROJECT_ID = os.environ["PROJECT_ID"]
INSTANCE_ID = os.environ["INSTANCE_ID"]

def start_instance(request):
    service = build("sqladmin", "v1beta4", cache_discovery=False)

    body = {
        "settings": {
            "activationPolicy": "ALWAYS",
        }
    }

    operation = (
        service.instances()
        .patch(project=PROJECT_ID, instance=INSTANCE_ID, body=body)
        .execute()
    )

    return {
        "message": "start requested",
        "operation": operation.get("name"),
    }, 200
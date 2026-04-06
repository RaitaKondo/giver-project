import os
from googleapiclient.discovery import build

PROJECT_ID = os.environ["PROJECT_ID"]
INSTANCE_ID = os.environ["INSTANCE_ID"]

def stop_instance(request):
    service = build("sqladmin", "v1beta4", cache_discovery=False)

    body = {
        "settings": {
            "activationPolicy": "NEVER",
        }
    }

    operation = (
        service.instances()
        .patch(project=PROJECT_ID, instance=INSTANCE_ID, body=body)
        .execute()
    )

    return {
        "message": "stop requested",
        "operation": operation.get("name"),
    }, 200
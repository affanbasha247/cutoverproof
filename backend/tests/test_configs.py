import json

from app.api.deps import get_configs_dir
from app.main import app


def test_config_list_is_empty_without_files(client, tmp_path):
    app.dependency_overrides[get_configs_dir] = lambda: tmp_path

    response = client.get("/api/configs")

    assert response.status_code == 200
    assert response.json() == {"configs": []}


def test_config_list_reports_real_files(client, tmp_path):
    sample = tmp_path / "old_iam.json"
    sample.write_text(json.dumps({"users": [], "roles": []}), encoding="utf-8")
    app.dependency_overrides[get_configs_dir] = lambda: tmp_path

    response = client.get("/api/configs")
    body = response.json()

    assert response.status_code == 200
    assert len(body["configs"]) == 1
    assert body["configs"][0]["id"] == "old_iam"
    assert body["configs"][0]["filename"] == "old_iam.json"
    assert body["configs"][0]["size_bytes"] == sample.stat().st_size
    assert body["configs"][0]["modified_at"]

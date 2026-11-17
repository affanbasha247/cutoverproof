import json

from app.api.deps import get_reports_dir
from app.main import app


def _write_report(directory, name, payload):
    (directory / name).write_text(json.dumps(payload), encoding="utf-8")


def test_overview_is_empty_without_reports(client, tmp_path):
    app.dependency_overrides[get_reports_dir] = lambda: tmp_path

    response = client.get("/api/overview")

    assert response.status_code == 200
    assert response.json() == {
        "scenarios_tested": 0,
        "safe_transitions": 0,
        "unsafe_transitions": 0,
        "attack_paths": 0,
        "latest_activity": None,
        "security_status": "no_data",
    }


def test_overview_derives_totals_from_report_files(client, tmp_path):
    _write_report(
        tmp_path,
        "safe-run.json",
        {
            "title": "Safe cutover",
            "security_status": "safe",
            "scenarios_tested": 2,
            "attack_paths": [],
            "created_at": "2026-11-17T10:00:00+00:00",
        },
    )
    _write_report(
        tmp_path,
        "unsafe-run.json",
        {
            "title": "Surviving grant",
            "security_status": "unsafe",
            "scenarios_tested": 1,
            "attack_paths": [
                {"source": "employee-a", "target": "sensitive-bucket"},
                {"source": "employee-a", "target": "customer-key"},
            ],
            "created_at": "2026-11-17T11:00:00+00:00",
        },
    )
    app.dependency_overrides[get_reports_dir] = lambda: tmp_path

    response = client.get("/api/overview")
    body = response.json()

    assert response.status_code == 200
    assert body["scenarios_tested"] == 3
    assert body["safe_transitions"] == 1
    assert body["unsafe_transitions"] == 1
    assert body["attack_paths"] == 2
    assert body["security_status"] == "at_risk"
    assert body["latest_activity"]["security_status"] == "at_risk"
    assert body["latest_activity"]["title"] in {"Safe cutover", "Surviving grant"}


def test_overview_marks_unknown_reports_as_unknown(client, tmp_path):
    _write_report(
        tmp_path,
        "unclassified.json",
        {"title": "Legacy analysis", "scenarios_tested": 1},
    )
    app.dependency_overrides[get_reports_dir] = lambda: tmp_path

    response = client.get("/api/overview")
    body = response.json()

    assert response.status_code == 200
    assert body["security_status"] == "unknown"
    assert body["safe_transitions"] == 0
    assert body["unsafe_transitions"] == 0

import json

from app.api.deps import get_reports_dir
from app.main import app


def test_reports_endpoint_lists_and_returns_local_json(client, tmp_path):
    report = {
        "title": "Demo analysis",
        "security_status": "safe",
        "created_at": "2026-11-17T12:00:00+00:00",
        "attack_paths": [],
    }
    (tmp_path / "demo-report.json").write_text(json.dumps(report), encoding="utf-8")
    app.dependency_overrides[get_reports_dir] = lambda: tmp_path

    listing = client.get("/api/reports")
    assert listing.status_code == 200
    assert listing.json()["reports"] == [
        {
            "id": "demo-report",
            "filename": "demo-report.json",
            "created_at": "2026-11-17T12:00:00+00:00",
            "security_status": "safe",
        }
    ]

    detail = client.get("/api/reports/demo-report")
    assert detail.status_code == 200
    assert detail.json() == report


def test_report_detail_rejects_path_traversal(client, tmp_path):
    app.dependency_overrides[get_reports_dir] = lambda: tmp_path

    response = client.get("/api/reports/..%2Fsecrets")

    assert response.status_code in {400, 404}

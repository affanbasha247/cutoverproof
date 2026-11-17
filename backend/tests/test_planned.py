import pytest


@pytest.mark.parametrize(
    ("path", "phase"),
    [
        ("/api/analysis/run", 2),
        ("/api/simulation/run", 2),
        ("/api/verification/run", 3),
        ("/api/planner/run", 5),
    ],
)
def test_planned_endpoints_return_explicit_501(client, path, phase):
    response = client.post(path)

    assert response.status_code == 501
    detail = response.json()["detail"]
    assert detail["phase"] == phase
    assert f"Phase {phase}" in detail["message"]

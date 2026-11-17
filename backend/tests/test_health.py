def test_health_returns_service_metadata(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "cutoverproof-api",
        "version": "0.1.0",
        "mode": "local-simulation",
    }

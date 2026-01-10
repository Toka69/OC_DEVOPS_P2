.PHONY: start stop backend-logs frontend-logs logs

# Start backend and frontend in detached mode
start:
	@echo "🚀 Starting Spring Boot backend in detached mode..."
	nohup mvn -f backend/pom.xml spring-boot:run > backend.log 2>&1 &
	@echo "🚀 Starting frontend in detached mode..."
	cd frontend && nohup npm run start > ../frontend.log 2>&1 &
	@echo "✅ Backend and frontend started in background!"

# Stop backend and frontend (with SIGTERM and fallback to SIGKILL)
stop:
	@echo "🛑 Stopping backend and frontend..."
	- pkill -f "spring-boot:run" || true
	- pkill -f "ng serve" || true
	@echo "✅ Backend and frontend stopped."

backend-logs:
	tail -f backend.log

frontend-logs:
	tail -f frontend/frontend.log

logs:
	tail -f backend.log & tail -f frontend.log

.PHONY: start stop backend-logs frontend-logs logs links restart restart-logs

# ANSI color
GREEN = \033[32m

init:
	mvn -f backend/pom.xml clean install &
	cd frontend && npm install --legacy-peer-deps

# Start backend and frontend in detached mode
start:
	@echo "🚀 Starting Spring Boot backend in detached mode..."
	nohup mvn -f backend/pom.xml spring-boot:run > backend.log 2>&1 &
	@echo "🚀 Starting frontend in detached mode..."
	cd frontend && nohup npm run start > ../frontend.log 2>&1 &
	@echo "✅ Backend and frontend started in background!"
	@make --no-print-directory links

# Stop backend and frontend (with SIGTERM and fallback to SIGKILL)
stop:
	@echo "🛑 Stopping backend and frontend..."
	- pkill -f "spring-boot:run" || true
	- pkill -f "ng serve" || true
	@echo "✅ Backend and frontend stopped."

restart:
	@$(MAKE) stop --no-print-directory
	@sleep 2
	@$(MAKE) start --no-print-directory

restart-logs:
	@$(MAKE) restart --no-print-directory
	@$(MAKE) logs --no-print-directory

links:
	@echo "$(GREEN)Frontend app accessible at http://localhost:4200"
	@echo "$(GREEN)Backend api accessible at http://localhost:8181"

backend-logs:
	tail -f backend.log

frontend-logs:
	tail -f frontend.log

logs:
	tail -f backend.log & tail -f frontend.log

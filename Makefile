# Test targets
.PHONY: test
test: test_model test_service

.PHONY: pip_deps
pip_deps:
	python -m pip install --upgrade pip && \
	pip install -r BiomedNER/requirements.txt && \
	pip install -r MedsRecognition/requirements.txt

.PHONY: test_model
test_model: pip_deps
	cd BiomedNER && \
	python -m unittest tests/main_test.py

.PHONY: test_service
test_service: pip_deps
	export DJANGO_SETTINGS_MODULE=MedsRecognition.settings && \
	cd MedsRecognition && \
	python manage.py test

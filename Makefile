# Test targets
.PHONY: test
test: test_model test_core

.PHONY: pip_deps
pip_deps:
	python -m pip install --upgrade pip && \
	pip install -r model/requirements.txt && \
	pip install -r core/requirements.txt

.PHONY: test_model
test_model: pip_deps
	cd model && \
	python -m unittest tests/main_test.py

.PHONY: test_core
test_service: pip_deps
	export DJANGO_SETTINGS_MODULE=MedsRecognition.settings && \
	cd core && \
	python manage.py test

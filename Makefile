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


# Build image targets

# Variables
MODEL_IMAGE_NAME = pill-checker-model
CORE_IMAGE_NAME = pill-checker-core
UI_IMAGE_NAME = pill-checker-ui
IMAGE_REGISTRY = ghcr.io
IMAGE_REPOSITORY = sperekrestova
IMAGE_VERSION = latest

MODEL_IMAGE_TAG = $(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(MODEL_IMAGE_NAME):$(IMAGE_VERSION)
CORE_IMAGE_TAG = $(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(CORE_IMAGE_NAME):$(IMAGE_VERSION)
UI_IMAGE_TAG = $(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(UI_IMAGE_NAME):$(IMAGE_VERSION)

# If the environment variable PUSH is non-empty, include the --push flag.
PUSH_PARAMS = $(if $(PUSH),--push,)

.PHONY: image-model
image-model:
	docker buildx build -t $(MODEL_IMAGE_TAG) $(PUSH_PARAMS) -f model/Dockerfile model

.PHONY: image-core
image-core:
	docker buildx build -t $(CORE_IMAGE_TAG) $(PUSH_PARAMS) -f core/Dockerfile core

.PHONY: image-ui
image-ui:
	docker buildx build -t $(UI_IMAGE_TAG) $(PUSH_PARAMS) -f ui/Dockerfile ui

.PHONY: image
image: image-model image-core image-ui

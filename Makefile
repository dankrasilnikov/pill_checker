# Test targets
.PHONY: test
test: test_model test_core

.PHONY: pip_deps pip_base pip_core pip_model_basic pip_model_numerical pip_model_ml pip_model_nlp

# Detect Apple Silicon
UNAME_MACHINE := $(shell uname -m)
ifeq ($(UNAME_MACHINE),arm64)
    # Environment variables for M1 compatibility
    ENV_VARS = CFLAGS="-march=armv8-a+fp+simd" CXXFLAGS="-march=armv8-a+fp+simd" ARCHFLAGS="-arch arm64" MACOSX_DEPLOYMENT_TARGET=11.0
else
    # Default environment variables for other platforms
    ENV_VARS =
endif

pip_base:
	$(ENV_VARS) python -m pip install --upgrade "pip<23.0" "setuptools<60.0"

pip_core: pip_base
	$(ENV_VARS) pip install --no-cache-dir -r core/requirements.txt

pip_model_basic: pip_core
	$(ENV_VARS) pip install --no-cache-dir fastapi==0.112.2 httpx==0.28.1 pydantic==2.10.5 pytest==7.4.0

pip_model_numerical: pip_model_basic
	$(ENV_VARS) pip install --no-cache-dir uvicorn==0.34.0 scipy==1.10.1

pip_model_ml: pip_model_numerical
	$(ENV_VARS) pip install --no-cache-dir scikit-learn==1.1.2

pip_model_nlp: pip_model_ml
	# Install spaCy first
	$(ENV_VARS) pip install --no-cache-dir spacy==3.7.4
ifeq ($(UNAME_MACHINE),arm64)
	# Special handling for M1: install scispacy without dependencies first
	$(ENV_VARS) pip install --no-cache-dir --no-deps scispacy==0.5.4
	# Then install its dependencies excluding nmslib
	$(ENV_VARS) pip install --no-cache-dir "spacy>=3.0.0,<4.0.0" "numpy>=1.15.0" "conllu>=4.0" "requests>=2.0.0,<3.0.0" "tqdm>=4.38.0"
	# Install nmslib with optimizations
	$(ENV_VARS) CFLAGS="-O3 -march=armv8-a+fp+simd" CXXFLAGS="-O3 -march=armv8-a+fp+simd" pip install --no-cache-dir --no-binary nmslib nmslib==2.1.1
else
	# Normal installation for other platforms
	$(ENV_VARS) pip install --no-cache-dir scispacy==0.5.4
endif
	# Install the model
	$(ENV_VARS) pip install --no-cache-dir https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz

pip_deps: pip_model_nlp

.PHONY: test_model
test_model: pip_deps
	cd model && \
	python -m unittest tests/main_test.py

.PHONY: test_core
test_core: pip_deps
	cd core && \
	pytest --cov=app tests/ && \
	coverage report --show-missing > coverage_report.txt

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
	docker buildx build --platform linux/amd64,linux/arm64 -t $(MODEL_IMAGE_TAG) $(PUSH_PARAMS) -f model/Dockerfile model

.PHONY: image-core
image-core:
	docker buildx build --platform linux/amd64,linux/arm64 -t $(CORE_IMAGE_TAG) $(PUSH_PARAMS) -f core/Dockerfile core

.PHONY: image-ui
image-ui:
	docker buildx build --platform linux/amd64,linux/arm64 -t $(UI_IMAGE_TAG) $(PUSH_PARAMS) -f ui/Dockerfile ui

.PHONY: image
image: image-model image-core image-ui

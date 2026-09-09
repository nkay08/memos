# Fork CI: Rebase & Build

Automated workflow to rebase onto upstream [usememos/memos](https://github.com/usememos/memos) and build a container image.

## Setup

### 1. Create a Personal Access Token (PAT)

The workflow needs a PAT to push the rebased branch. `GITHUB_TOKEN` cannot do this (GitHub prevents infinite workflow loops).

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Create a token with:
   - **Repository access:** Only select repositories → choose this fork
   - **Permissions → Repository permissions → Contents:** Read and write
3. Copy the token

### 2. Add the secret

1. Go to **Repository → Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `REBASE_TOKEN`
4. Value: paste the PAT from step 1

### 3. Enable GHCR (if not already)

GitHub Container Registry is enabled by default for public repos. For private repos:

1. Go to **Repository → Settings → Actions → General**
2. Under **Workflow permissions**, select **Read and write permissions**

## Usage

1. Go to **Actions → Rebase & Build → Run workflow**
2. Options:
   - **source_branch** — your branch with custom changes (default: `main`)
   - **target_branch** — upstream branch to rebase onto (default: `main`)
   - **output_branch** — branch to push rebased result to (default: `fork-main`)
   - **push_image** — build and push container image (default: `true`)
3. Click **Run workflow**

The workflow never force-pushes to your `source_branch`. It pushes the rebased
result to `output_branch` (e.g. `fork-main`), which is safe to overwrite on
each run.

## What it does

```
checkout source_branch → rebase onto upstream → push to output_branch → build frontend → build image → merge manifest
```

1. **Rebase:** checks out `source_branch`, fetches `upstream/target_branch`, rebases, pushes result to `output_branch`
2. **Frontend:** installs pnpm + node, runs `pnpm release`, uploads dist as artifact
3. **Build:** builds multi-arch Docker image using `scripts/Dockerfile` (frontend injected from artifact)
4. **Merge:** creates multi-arch manifest, tags as `fork-latest` and `fork-YYYYMMDD`

Your `source_branch` is never modified by CI.

## Image

```bash
# Pull
docker pull ghcr.io/<owner>/<repo>:fork-latest

# Run
docker run --rm -p 5230:5230 -v memos-data:/var/opt/memos ghcr.io/<owner>/<repo>:fork-latest
```

## Conflict handling

If the rebase fails (merge conflicts), the workflow stops. Resolve locally:

```bash
# Check out your source branch
git checkout main

# Fetch upstream
git remote add upstream https://github.com/usememos/memos.git  # if not already added
git fetch upstream

# Rebase
git rebase upstream/main
# ... resolve conflicts ...
git rebase --continue

# Push the resolved result to the output branch
git push origin main:fork-main --force-with-lease
```

Then trigger the workflow again (or build locally from `fork-main`).

## Local build (without CI)

```bash
# Full build (frontend + backend)
podman build -t memos -f Dockerfile.full .

# Backend only (requires pre-built frontend in server/router/frontend/dist/)
podman build -t memos -f scripts/Dockerfile .

# Run
podman run --rm -p 5230:5230 -v memos-data:/var/opt/memos localhost/memos
```

To build from the rebased branch locally:

```bash
git checkout fork-main
podman build -t memos -f Dockerfile.full .
```

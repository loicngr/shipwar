install:
	@pnpm install

front-dev:
	@pnpm -F client run dev

back-dev:
	@pnpm -F server run start:dev

common-build:
	@pnpm -F @shipwar/common run build
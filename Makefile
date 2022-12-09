ECHO=echo '>>>>>>'
EXEC=

# programs
AWS_CLI=aws
CD=cd
DOCKER=docker
EB_CLI=eb
NG=ng
NODE=node

all:
	@echo "Basic commands for developers/admins"
	@echo "      make deploy-{stage,prod}"

.PHONY :
.PHONY :   check-aws-account check-version-number  guard-prod deploy-stage deploy-prod

deploy-screenjs: check-aws-account check-version-number
	@$(ECHO) $(NODE) versioninfo.js > src/environments/versioninfo.ts ;\
	$(EXEC) $(NODE) versioninfo.js > src/environments/versioninfo.ts || exit;\
	$(ECHO) $(NG) build --configuration=$(ENV) $(TARGET) $(AOT) ;\
	$(EXEC) $(NG) build --configuration=$(ENV) $(TARGET) $(AOT) || exit ;\
	$(ECHO) $(AWS_CLI) s3 cp --recursive --acl public-read dist/ s3://$(BUCKET)/$(VERSION) ;\
	$(EXEC) $(AWS_CLI) s3 cp --recursive --acl public-read dist/ s3://$(BUCKET)/$(VERSION) || exit ;\
	$(ECHO) $(AWS_CLI) s3 rm --recursive s3://$(BUCKET)/live ;\
	$(EXEC) $(AWS_CLI) s3 rm --recursive s3://$(BUCKET)/live || exit ;\
	$(ECHO) $(AWS_CLI) s3 cp --recursive --acl public-read dist/ s3://$(BUCKET)/live ;\
	$(EXEC) $(AWS_CLI) s3 cp --recursive --acl public-read dist/ s3://$(BUCKET)/live 

check-aws-account:
	@if [ "x$$AWS_ACCOUNT" == "x" ]; then \
		echo "Error: Need an AWS_ACCOUNT environment variable" 1>&2; \
		exit 1; \
	fi;

check-version-number:
	@if [ "x$$VERSION" == "x" ]; then \
		echo "Error: Need a VERSION environment variable (e.g VERSION=1.0.2)" 1>&2; \
		exit 1; \
	fi;

guard-prod: 
	@echo "CAUTION: About to write into production. This is a BIG DEAL(TM)."; \
	echo "        Enter \"PRODUCTION\" to verify that you wish to proceed."; \
	echo ; \
	echo -n "> " ; \
	read production ; \
	if [ "$$production" != "PRODUCTION" ]; then \
		exit 1; \
	fi;

deploy-stage:
	@$(MAKE) ENV=stage BUCKET=screen.stage.addulate.com TARGET= VERSION=`git describe --tags --long --dirty` deploy-screenjs 

deploy-prod: guard-prod
	@$(MAKE) ENV=production BUCKET=screen.prod.addulate.com TARGET= AOT=--aot VERSION=`git describe --tags --long --dirty` deploy-screenjs


testme:
	echo $(VERSION)

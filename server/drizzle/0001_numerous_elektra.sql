ALTER TABLE "patients" ALTER COLUMN "diagnosis" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "diagnosis" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "diagnosis" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "medications" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "medications" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "medications" SET NOT NULL;
-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('mentor', 'student', 'admin');

-- CreateTable
CREATE TABLE "sust_cp_lab_cf_cache" (
    "username" VARCHAR(255) NOT NULL,
    "info" JSON,

    CONSTRAINT "sust_cp_lab_cf_cache_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_cf_handles" (
    "username" VARCHAR(255) NOT NULL,
    "handle" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "sust_cp_lab_contestregistrations" (
    "contest_id" INTEGER NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "sust_cp_lab_contestregistrations_pkey" PRIMARY KEY ("contest_id","user_name")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_contests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "venue" VARCHAR(35) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "type" VARCHAR(35) NOT NULL,
    "date" VARCHAR(25) NOT NULL,
    "poster" VARCHAR(255),
    "author" VARCHAR(255) NOT NULL DEFAULT 'Rony',

    CONSTRAINT "sust_cp_lab_contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_student_info" (
    "username" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "registration_no" VARCHAR(10) NOT NULL,
    "vjudge_handle" VARCHAR(255),

    CONSTRAINT "sust_cp_lab_student_info_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_team_members" (
    "team_id" INTEGER NOT NULL,
    "user_name" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "sust_cp_lab_teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contest" VARCHAR(255) NOT NULL,

    CONSTRAINT "sust_cp_lab_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_users" (
    "username" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_type" "user_type" DEFAULT 'student',

    CONSTRAINT "sust_cp_lab_users_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "sust_cp_lab_team_members_team_id_user_name_key" ON "sust_cp_lab_team_members"("team_id", "user_name");

-- CreateIndex
CREATE UNIQUE INDEX "sust_cp_lab_users_email_key" ON "sust_cp_lab_users"("email");

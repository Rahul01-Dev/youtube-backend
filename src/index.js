import dotenv from 'dotenv'
import express from "express";
import connectDb from './db/dbconnect.js';

dotenv.config();

connectDb();
import aws from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

import { IMailProvider } from "../IMailProvider";

class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: unknown,
    path: string
  ): Promise<void> {
    const templateFile = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFile);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: "Rentx <vini@santoryu.net>",
      subject,
      html: templateHTML,
    });
  }
}

export { SESMailProvider };

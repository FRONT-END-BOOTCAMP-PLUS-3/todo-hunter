import  nodemailer from 'nodemailer';
import { GenerateVerifyCodeUsecase } from "@/application/usecases/auth/GenerateVerifyCodeUsecase";
import { IVerificationRepository } from "@/domain/repositories/IVerificationRepository";
import { sendEmailTemplate } from '@/constants/email';

export class SendEmailUsecase {
  private transporter;
  constructor(
    private generateVerificationCodeUseCase : GenerateVerifyCodeUsecase,
    private verificationRepository : IVerificationRepository
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // .env에서 관리
      port: parseInt(process.env.SMTP_PORT as string, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async execute(email: string): Promise<void> {
    if (!email) 
      throw new Error("이메일을 입력해야 합니다.");
    
    const verificationCode = this.generateVerificationCodeUseCase.execute();
    console.log(`🔹 생성된 인증 코드: ${verificationCode}`);

    await this.verificationRepository.saveVerificationCode(email, verificationCode, 300);

    const emailHtml = sendEmailTemplate(verificationCode);
    const mailOptions = {
      from: `"TODO HUNTER Team" <${process.env.SMTP_USER_EMAIL}>`,
      to:email,
      subject: "[TODO HUNTER] 이메일 인증을 완료해주세요.",
      html: emailHtml,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
import  nodemailer from 'nodemailer';
import { GenerateVerifyCodeUsecase } from "@/application/usecases/auth/GenerateVerifyCodeUsecase";
import { IVerificationRepository } from "@/domain/repositories/IVerificationRepository";
import { sendSignUpEmailTemplate } from '@/utils/sendEmailTemplate';

export class SendSignUpEmailUsecase {
  private transporter;
  constructor(
    private generateVerifyCodeUsecase : GenerateVerifyCodeUsecase,
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
      logger: true, // 디버그 로그 활성화
      debug: true,  // 디버그 로그 활성화
    });
  }

  async execute(email: string): Promise<void> {
    if (!email) 
      throw new Error("이메일을 입력해야 합니다.");
    
    const verificationCode = this.generateVerifyCodeUsecase.execute();
    console.log(`🔹 생성된 인증 코드: ${verificationCode}`);

    await this.verificationRepository.saveVerificationCode(email, verificationCode, 300);

    const emailHtml = sendSignUpEmailTemplate(verificationCode);
    const mailOptions = {
      from: `"TODO HUNTER Team" <${process.env.SMTP_USER_EMAIL}>`,
      to:email,
      subject: "[TODO HUNTER] 이메일 인증을 완료해주세요.",
      html: emailHtml,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
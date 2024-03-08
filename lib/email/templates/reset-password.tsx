import { render } from "@react-email/render";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { APP_TITLE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

interface Props {
  name: string;
  link: string;
  ipAddress: string;
}

export const ResetPasswordEmail = ({ name, link, ipAddress }: Props) => {
  const previewText = `Reset your password for ${APP_TITLE}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={absoluteUrl("/public/logo.png")}
                width="40"
                height="37"
                alt={APP_TITLE}
                className="my-0 mx-auto"
              />
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Someone recently requested a password change for your {APP_TITLE}{" "}
              account. If this was you, you can set a new password here:
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={link}
              >
                Reset password
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{name}</span>. This invite was sent
              from <span className="text-black">{ipAddress}</span>. If you were
              not expecting this password reset, you can ignore and delete this
              email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderResetPasswordEmail = ({ link, name, ipAddress }: Props) =>
  render(<ResetPasswordEmail link={link} name={name} ipAddress={ipAddress} />);

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
  username: string;
  link: string;
  ipAddress: string;
}

export const ResetPasswordEmail = ({ username, link, ipAddress }: Props) => {
  const previewText = `Reset your password for ${APP_TITLE}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={absoluteUrl("/public/logo.png")}
                width="40"
                height="37"
                alt={APP_TITLE}
                className="mx-auto my-0"
              />
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Someone recently requested a password change for your {APP_TITLE}{" "}
              account. If this was you, you can set a new password here:
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Reset password
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>. This invite was
              sent from <span className="text-black">{ipAddress}</span>. If you
              were not expecting this password reset, you can ignore and delete
              this email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderResetPasswordEmail = ({
  link,
  username,
  ipAddress,
}: Props) =>
  render(
    <ResetPasswordEmail
      link={link}
      username={username}
      ipAddress={ipAddress}
    />,
  );

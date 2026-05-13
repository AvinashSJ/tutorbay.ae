import { useState } from "react";
import useIsSecondary from "@/hooks/useIsSecondary";
import { getSupabase } from "@/libs/supabase";
import { trackNewsletterSubscribe } from "@/services/analytics";
import FooterTopLeft from "./FooterTopLeft";

const FooterTop = () => {
  const { isSecondary } = useIsSecondary();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);

    const supabase = getSupabase();
    const { error } = await supabase
      .from("Subscriber")
      .insert({ email: email.trim() });

    if (error) {
      if (error.code === "23505") {
        setMessage({ type: "info", text: "You are already subscribed!" });
      } else {
        setMessage({ type: "error", text: "Something went wrong. Try again." });
      }
    } else {
      trackNewsletterSubscribe(email.trim());
      setMessage({ type: "success", text: "Subscribed successfully!" });
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <section>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 md:gap-y-0 items-center pb-45px border-b border-darkcolor ${
          isSecondary ? "gap-y-5" : "gap-y-30px"
        }`}
      >
        <FooterTopLeft />
        <div data-aos="fade-up">
          <form
            onSubmit={handleSubmit}
            className="max-w-form-xl md:max-w-form-md lg:max-w-form-lg xl:max-w-form-xl 2xl:max-w-form-2xl bg-deepgray ml-auto rounded relative"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              required
              className="text-whiteColor h-62px pl-15px focus:outline-none border border-deepgray focus:border-whitegrey bg-transparent rounded w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 md:px-10px lg:px-5 bg-primaryColor hover:bg-deepgray disabled:opacity-60 text-xs lg:text-size-15 text-whiteColor border border-primaryColor block rounded absolute right-0 top-0 h-full"
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-2 text-sm text-center md:text-right ${
                message.type === "success"
                  ? "text-green-400"
                  : message.type === "info"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FooterTop;

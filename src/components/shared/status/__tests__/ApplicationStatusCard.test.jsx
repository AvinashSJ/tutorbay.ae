import { render, screen, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ApplicationStatusCard from "../ApplicationStatusCard";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/libs/supabase", () => ({
  getSupabase: jest.fn(),
}));

jest.mock("@/redux/services/userSlice", () => {
  const STATUS = {
    DRAFT: "DRAFT",
    PENDING_REVIEW: "PENDING_REVIEW",
    ADDITIONAL_INFO_REQUIRED: "ADDITIONAL_INFO_REQUIRED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  };
  return { TUTOR_APPLICATION_STATUS: STATUS };
});

const TUTOR_APPLICATION_STATUS = {
  PENDING_REVIEW: "PENDING_REVIEW",
  ADDITIONAL_INFO_REQUIRED: "ADDITIONAL_INFO_REQUIRED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

describe("ApplicationStatusCard", () => {
  const push = jest.fn();
  const onAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useRouter.mockReturnValue({ push });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("status rendering", () => {
    test("renders PENDING_REVIEW status correctly", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.getByText("Application Under Review")).toBeInTheDocument();
      expect(screen.getByText("Pending Review")).toBeInTheDocument();
      expect(screen.getByText(/has been submitted and is being reviewed/)).toBeInTheDocument();
    });

    test("renders ADDITIONAL_INFO_REQUIRED status correctly", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED} />);
      expect(screen.getByText("Additional Information Required")).toBeInTheDocument();
      expect(screen.getByText("Info Required")).toBeInTheDocument();
      expect(screen.getByText(/needs more information/)).toBeInTheDocument();
    });

    test("renders APPROVED status correctly", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      expect(screen.getByText("Application Approved")).toBeInTheDocument();
      expect(screen.getByText("Approved")).toBeInTheDocument();
      expect(screen.getByText(/has been approved/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Go to My Profile/i })).toBeInTheDocument();
    });

    test("renders REJECTED status correctly", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} />);
      expect(screen.getByText("Application Rejected")).toBeInTheDocument();
      expect(screen.getByText("Rejected")).toBeInTheDocument();
      expect(screen.getByText(/was not approved/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Reapply/i })).toBeInTheDocument();
    });

    test("renders default status for unknown status", () => {
      render(<ApplicationStatusCard status={"UNKNOWN_STATUS"} />);
      expect(screen.getByText("Application Status")).toBeInTheDocument();
      expect(screen.getByText("Processing")).toBeInTheDocument();
    });
  });

  describe("adminNotes", () => {
    test("shows admin notes when provided for PENDING_REVIEW", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} adminNotes="Please upload your degree certificate." />);
      expect(screen.getByText("Admin Notes")).toBeInTheDocument();
      expect(screen.getByText("Please upload your degree certificate.")).toBeInTheDocument();
    });

    test("shows rejection reason for REJECTED status", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} adminNotes="Insufficient qualifications." />);
      expect(screen.getByText("Rejection Reason")).toBeInTheDocument();
      expect(screen.getByText("Insufficient qualifications.")).toBeInTheDocument();
    });

    test("does not show admin notes panel when not provided", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.queryByText("Admin Notes")).not.toBeInTheDocument();
      expect(screen.queryByText("Rejection Reason")).not.toBeInTheDocument();
    });
  });

  describe("action buttons", () => {
    test("shows Go to My Profile button only for APPROVED", () => {
      const { rerender } = render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      expect(screen.getByRole("button", { name: /Go to My Profile/i })).toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.queryByRole("button", { name: /Go to My Profile/i })).not.toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} />);
      expect(screen.queryByRole("button", { name: /Go to My Profile/i })).not.toBeInTheDocument();
    });

    test("shows Reapply button only for REJECTED", () => {
      const { rerender } = render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} />);
      expect(screen.getByRole("button", { name: /Reapply/i })).toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.queryByRole("button", { name: /Reapply/i })).not.toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      expect(screen.queryByRole("button", { name: /Reapply/i })).not.toBeInTheDocument();
    });

    test("Go to My Profile button navigates to /instructor-profile", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      screen.getByRole("button", { name: /Go to My Profile/i }).click();
      expect(push).toHaveBeenCalledWith("/instructor-profile");
    });

    test("Reapply button navigates to /tutor-registration", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} />);
      screen.getByRole("button", { name: /Reapply/i }).click();
      expect(push).toHaveBeenCalledWith("/tutor-registration");
    });

    test("shows Resubmit button only for ADDITIONAL_INFO_REQUIRED", () => {
      const { rerender } = render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED} />);
      expect(screen.getByRole("button", { name: /Resubmit/i })).toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.queryByRole("button", { name: /Resubmit/i })).not.toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      expect(screen.queryByRole("button", { name: /Resubmit/i })).not.toBeInTheDocument();

      rerender(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.REJECTED} />);
      expect(screen.queryByRole("button", { name: /Resubmit/i })).not.toBeInTheDocument();
    });

    test("Resubmit button navigates to /tutor-registration", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED} />);
      screen.getByRole("button", { name: /Resubmit/i }).click();
      expect(push).toHaveBeenCalledWith("/tutor-registration");
    });
  });

  describe("countdown timer", () => {
    test("shows initial countdown of 30s", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText(/Auto-redirecting/)).toBeInTheDocument();
    });

    test("decrements every second", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);
      expect(screen.getByText("30")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByText("25")).toBeInTheDocument();
    });

    test("calls onAction and redirects when countdown reaches 0", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} onAction={onAction} />);

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(onAction).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith("/");
    });

    test("calls onAction with default noop when not provided", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(push).toHaveBeenCalledWith("/");
    });

    test("countdown reaches 0 and triggers redirect", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.PENDING_REVIEW} />);

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(push).toHaveBeenCalledWith("/");
    });

    test("countdown redirects to /instructor-profile for APPROVED status", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);

      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(push).toHaveBeenCalledWith("/instructor-profile");
    });

    test("shows profile redirect text for APPROVED status", () => {
      render(<ApplicationStatusCard status={TUTOR_APPLICATION_STATUS.APPROVED} />);
      expect(screen.getByText(/Redirecting to your profile/)).toBeInTheDocument();
    });
  });
});

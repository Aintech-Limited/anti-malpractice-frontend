import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { MessageCircle } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No items found",
    description: "Get started by creating your first item.",
    action: {
      label: "Create Item",
      onClick: () => console.log("Create clicked"),
    },
  },
};

export const WithSearchIcon: Story = {
  args: {
    title: "No results found",
    description:
      "We couldn't find any courses matching your search criteria. Try adjusting your filters.",
    icon: "search",
    action: {
      label: "Clear Filters",
      onClick: () => console.log("Clear filters clicked"),
      variant: "outline",
    },
  },
};

export const NoCourses: Story = {
  args: {
    title: "No courses available",
    description:
      "There are no courses available for this semester. Please check back later or contact your academic advisor.",
    icon: "book",
    action: {
      label: "Browse Catalog",
      onClick: () => console.log("Browse clicked"),
    },
    secondaryAction: {
      label: "Contact Advisor",
      onClick: () => console.log("Contact clicked"),
      variant: "outline",
    },
  },
};

export const NoDepartments: Story = {
  args: {
    title: "No departments found",
    description: "No academic departments are currently available.",
    icon: "building",
    action: {
      label: "Refresh",
      onClick: () => console.log("Refresh clicked"),
      variant: "primary",
    },
  },
};
export const NoExamsStory: Story = {
  args: {
    title: "No Exams found",
    description:
      "There are no upcoming exams available for registration at this time.",
    icon: "building",
    action: {
      label: "Refresh",
      onClick: () => console.log("Refresh clicked"),
      variant: "primary",
    },
  },
};

export const NoAccounts: Story = {
  args: {
    title: "No bank accounts linked",
    description:
      "Link your bank account to make payments and receive refunds easily.",
    icon: "credit-card",
    action: {
      label: "Add Account",
      onClick: () => console.log("Add account clicked"),
    },
  },
};

export const NoNotifications: Story = {
  args: {
    title: "All caught up!",
    description:
      "You have no unread notifications. We'll notify you when something important happens.",
    icon: "bell",
    action: {
      label: "View Archive",
      onClick: () => console.log("View archive clicked"),
      variant: "outline",
    },
  },
};

export const SmallSize: Story = {
  args: {
    title: "No items",
    description: "Get started by adding your first item.",
    icon: "plus",
    size: "sm",
    action: {
      label: "Add Item",
      onClick: () => console.log("Add clicked"),
    },
  },
};

export const LargeSize: Story = {
  args: {
    title: "Welcome to your dashboard",
    description:
      "Get started by setting up your profile and exploring the features.",
    icon: "school",
    size: "lg",
    action: {
      label: "Get Started",
      onClick: () => console.log("Get started clicked"),
    },
    secondaryAction: {
      label: "Learn More",
      onClick: () => console.log("Learn more clicked"),
      variant: "outline",
    },
  },
};

export const Bordered: Story = {
  args: {
    title: "Drop files here",
    description: "Drag and drop your files here or click to browse.",
    icon: "upload",
    bordered: true,
    action: {
      label: "Browse Files",
      onClick: () => console.log("Browse clicked"),
    },
  },
};

export const CustomIllustration: Story = {
  args: {
    title: "No messages yet",
    description: "Start a conversation with your instructors or classmates.",
    icon: "message",
    illustration: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-indigo-500" />
        </div>
      </div>
    ),
    action: {
      label: "Send Message",
      onClick: () => console.log("Send message clicked"),
    },
  },
};

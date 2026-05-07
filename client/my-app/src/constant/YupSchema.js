import * as yup from "yup";

export const AiPlanningSchema = yup.object({
  planningFor: yup.string().required("Select Planning For"),
  brideGroomName: yup.string().required("Enter Traveler Name"),
  contactPersonName: yup.string().required("Enter Contact Person Name"),
  phoneNumber: yup
    .string()
    .required("Enter Contact Person Phone Number")
    .matches(/^[0-9]+$/, "Phone number must be digits only ex:0300 0000000 ")
    .min(10, "Phone number must be at least 10 digits"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Enter Email Address"),

  weddingDate: yup.date().required("Select Trip Date"),

  events: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one event")
    .required("Select Events"),
  country: yup.string().required("Select Country"),
  city: yup.string().required("Select City"),
  venueType: yup.string().optional(),
  preferredAreas: yup.string().optional(),
  // estimatedGuestCount: yup.string().required("Number of guests").min(1,'must be grather then 1'),
  totalBudget: yup
    .number()
    .typeError("Budget must be a number")
    .positive("Budget must be a positive number")
    .required("Enter Budget"),
  budgetFlexibility: yup.string().required("Select Budget Flexibility"),
  budgetPriority: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one budget allocation priority")
    .required("Select Budget Allocation Priority"),
  weddingTheme: yup.string().required("Select Trip Theme"),
  culturalRequirements: yup.string().optional(),
  specialRituals: yup.string().optional(),
  cuisineType: yup.array().of(yup.string()).min(1, "Select at least one value"),
  entertainmentType: yup.array().of(yup.string()).optional(),
  danceFloor: yup.string().optional(),
  specialPerformance: yup.string().optional(),
  religious: yup.string().optional(),
  specialRequirements: yup.string().optional(),
});

export const RegisterSchema = yup.object({
  name: yup.string().trim().required("Enter full name"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
 
});

export const LoginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
});

export const ForgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
});

export const ResetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});


export const testimonialSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  message: yup
    .string()
    .required('Testimonial message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(500, 'Message must not exceed 500 characters'),
});
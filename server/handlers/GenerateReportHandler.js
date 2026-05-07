import UserBasicInformation from "../models/UserBasicInformationSchema.js";
import UserBudgetDetails from "../models/UserBudgetDetailsSchema.js";
import UserCatering from "../models/UserCateringSchema.js";
import UserEntertainment from "../models/UserEntertainmentSchema.js";
import UserGuestInfo from "../models/UserGuestInfoSchema.js";
import UserLocationPreferences from "../models/UserLocationPreferencesSchema.js";
import UserSpecialRequirements from "../models/UserSpecialRequirementsSchema.js";
import UserThemeStyle from "../models/UserThemeStyleSchema.js";
import UserWeddingDetails from "../models/UserWeddingDetailsSchema.js";
import {AiPromet} from "../prompts/wedding-planner-ai-promet.js"

export const generateReportHandler = async (data) => {
    try {
        const {
            userId,
            projectId,
            specialPerformance,
            danceFloor,
            entertainmentType,
            cuisineType,
            specialRituals,
            culturalRequirements,
            weddingTheme,
            budgetPriority,
            budgetFlexibility,
            totalBudget,
            
            preferredAreas,
            venueType,
            city,
            country,
            events,
            weddingDate,
            email,
            phoneNumber,
            contactPersonName,
            brideGroomName,
            planningFor,
            special_requirements,
        } = data;

        const common = { userId, projectId };

        const normalizeEventKey = (event) => String(event || "")
            .trim()
            .replace(/\s+/g, "_")
            .toLowerCase()

        const allEvents = ["Engagement", "Mehndi", "Barat", "Walima", "Reception", "Custom Event"]
        const eventGuestCounts = allEvents.reduce((acc, event) => {
            const key = `guestCount_${normalizeEventKey(event)}`
            const value = Number(data?.[key])
            acc[key] = Number.isFinite(value) ? value : 0
            return acc
        }, {})

        const totalGuestCount = Object.values(eventGuestCounts).reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0)

        const [
            basicInformation,
            weddingDetails,
            budgetDetails,
            guestInfo,
            locationPreferences,
            themeStyle,
            catering,
            entertainment,
            specialRequirements,
        ] = await Promise.all([
            UserBasicInformation.create({
                ...common,
                planningFor,
                brideGroomName,
                contactPersonName,
                phoneNumber,
                email,
            }),
            UserWeddingDetails.create({ ...common, weddingDate, events }),
            UserBudgetDetails.create({ ...common, totalBudget, budgetFlexibility, budgetPriority }),
            UserGuestInfo.create({ ...common, eventGuestCounts, totalGuestCount }),
            UserLocationPreferences.create({ ...common, country, city, venueType, preferredAreas }),
            UserThemeStyle.create({ ...common, weddingTheme, culturalRequirements, specialRituals }),
            UserCatering.create({ ...common, cuisineType }),
            UserEntertainment.create({ ...common, entertainmentType, danceFloor, specialPerformance }),
            UserSpecialRequirements.create({ ...common, special_requirements }),
        ]);
        return {
            ok: true,
            status: 201,
            message: "Report data saved successfully",
            data: {
                basicInformation,
                weddingDetails,
                budgetDetails,
                guestInfo,
                locationPreferences,
                themeStyle,
                catering,
                entertainment,
                specialRequirements,
            },
        };
    } catch (err) {
        return { ok: false, status: 500, message: "Internal server error",err };
    }
};

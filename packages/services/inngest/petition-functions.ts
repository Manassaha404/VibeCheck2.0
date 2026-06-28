import { inngest } from "./client";
import TagService from "../tag";
const createPetition = inngest.createFunction({
    id:"create-petition",
    triggers:[
        {
            event:"create/petition"
        }
    ]
}, async({event, step}) => {
    const {petitionId, tagsArray} = event.data;
    await step.run("add-tags-to-petition", async () => {
        await TagService.addTagsToPetitions(petitionId,tagsArray)
    })
})

const petitionFunctions = [createPetition];
export default petitionFunctions;
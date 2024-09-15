const { createUploadthing, FileRouter } = require("uploadthing/express");

const uploadthing = createUploadthing();

const uploadRouter = {
    imageUploader: uploadthing({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {
        console.log("Upload completed", data);
    }),
};

module.exports = uploadRouter;

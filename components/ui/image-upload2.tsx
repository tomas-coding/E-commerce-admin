"use client";
 
import { UploadButton } from "@/lib/uploadthing";
// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
 

 
 const Upload = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="courseImage"
        onClientUploadComplete={(res) => {
          // Do something with the 
          const file = res
          console.log(file?.[0].url)
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
export default Upload;
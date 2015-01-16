using UnityEngine;
using UnityEditor;
using System;
using System.IO;

using ICSharpCode.SharpZipLib.Zip;

public class Archive : ScriptableObject
{
    
    [MenuItem("Tools/Backup")]
    public static void Backup()
    {
        string dir = Directory.GetCurrentDirectory();
        //dir = ZipEntry.CleanName(@dir);


        string[] args = { dir, dir + "Back " + DateTime.Now.Day + "-" + DateTime.Now.Month + "-"+ DateTime.Now.Year + " "+ DateTime.Now.Hour + "h" + DateTime.Now.Minute + "m" + DateTime.Now.Second + "s.zip" };
        // Perform some simple parameter checking.  More could be done
        // like checking the target file name is ok, disk space, and lots
        // of other things, but for a demo this covers some obvious traps.
        if (args.Length < 2)
        {
            Debug.Log("Usage: CreateZipFile Path ZipFile");
            return;
        }

        if (!Directory.Exists(args[0]))
        {
            Debug.Log("Cannot find directory '{0}'" + args[0]);
            return;
        }

        try
        {
            // Depending on the directory this could be very large and would require more attention
            // in a commercial package.

            // Using GetFileName makes the result compatible with XP
            // as the resulting path is not absolute.
            using ( ZipOutputStream s = new ZipOutputStream(File.Create(args[1])))
            {
                s.SetLevel(5); // 0 - store only to 9 - means best compression
                // Finish/Close arent needed strictly as the using statement does this automatically
                Archive.zipDir(s, dir, Path.GetFileName(dir) + Path.DirectorySeparatorChar);
                // Finish is important to ensure trailing information for a Zip file is appended.  Without this
                // the created file would be invalid.
                s.Finish();

                // Close is important to wrap things up and unlock the file.
                s.Close();
            }
        }
        catch (Exception ex)
        {
            Debug.Log("Exception during processing {0}" + ex);

            // No need to rethrow the exception as for our purposes its handled.
        }

    }

    static void zipDir(ZipOutputStream s, string directory, string path)
    {
        string[] filenames = Directory.GetFiles(directory);
        string[] subDirectories = Directory.GetDirectories(directory);

        // 'using' statements gaurantee the stream is closed properly which is a big source
        // of problems otherwise.  Its exception safe as well which is great.

        

        byte[] buffer = new byte[4096];

        foreach (string file in filenames)
        {

            
            ZipEntry entry = new ZipEntry(path + Path.GetFileName(file));
            
            // Setup the entry data as required.

            // Crc and size are handled by the library for seakable streams
            // so no need to do them here.

            // Could also use the last write time or similar for the file.
            entry.DateTime = DateTime.Now;

            if (Path.GetFileName(file) != "AssetVersioning.db" )
            {
                s.PutNextEntry(entry);

                using (FileStream fs = File.OpenRead(file))
                {

                    // Using a fixed size buffer here makes no noticeable difference for output
                    // but keeps a lid on memory usage.
                    int sourceBytes;
                    do
                    {
                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                        s.Write(buffer, 0, sourceBytes);
                    } while (sourceBytes > 0);
                }
            }

        }

        foreach (string dir in subDirectories)
        {
            if ( Path.GetFileName(dir) != "Temp" )
            Archive.zipDir(s, dir, path + Path.GetFileName(dir) + Path.DirectorySeparatorChar);
        }
    }
}

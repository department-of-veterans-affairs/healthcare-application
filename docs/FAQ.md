# Questions no one asked (yet)

## Q. I get an error during `npm install`

If you get an error like:

```
  SOLINK(target) Release/xmljs.node
ld: library not found for -lgcc_s.10.5
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

...you might have a mis-installed tool chain.

On OSX Yosemite 10.10.5, you can fix this by uninstalling Xcode.

To do this, remove Xcode from the `/Applications` folder then delete the folder via:
`rm -rf /Library/Developer/CommandLineTools/`

After installation, you should have the following versions:

```bash
$ find /usr/lib -name '*gcc_s*'
/usr/lib/libgcc_s.1.dylib
/usr/lib/libgcc_s.10.4.tbd
/usr/lib/libgcc_s.10.5.tbd

$ md5 /usr/lib/libgcc_s.1*
MD5 (/usr/lib/libgcc_s.1.dylib) = d63d062351c807e98e337de46ee9edfd
MD5 (/usr/lib/libgcc_s.10.4.tbd) = ea71a1a8cd8a6608de4fbca4a2d20daf
MD5 (/usr/lib/libgcc_s.10.5.tbd) = ea71a1a8cd8a6608de4fbca4a2d20daf

$ xcode-select -v
xcode-select version 2339.

$ xcode-select -p
/Applications/Xcode.app/Contents/Developer

$ gcc --version
Configured with: --prefix=/Applications/Xcode.app/Contents/Developer/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 7.0.2 (clang-700.1.81)
Target: x86_64-apple-darwin14.5.0
Thread model: posix
```

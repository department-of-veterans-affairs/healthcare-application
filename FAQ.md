# Questions no one asked (yet)

## What development environment do I need beyond what is in `README.md`?

### OSX

#### Yosemite 10.10.5

Installing Xcode Version 7.2.1 (7C1002) should yield the following tools
and files:

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

#### El Capitan 10.11.5

```bash
$ gcc --version
Configured with: --prefix=/Library/Developer/CommandLineTools/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 7.3.0 (clang-703.0.31)
Target: x86_64-apple-darwin15.5.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

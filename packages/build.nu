let packages = (ls | where type == dir | each {|f| $f.name})

for $package in $packages {
  print $"Building @grapos/($package)"
  cd $package
  pnpm build
  cd ..
}


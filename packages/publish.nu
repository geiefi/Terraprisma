let packages = (ls | where type == dir | each {|f| $f.name})

for $package in $packages {
  print $"Publishing @grapos/($package)"
  cd $package
  pnpm publish
  cd ..
}


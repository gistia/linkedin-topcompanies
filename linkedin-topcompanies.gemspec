# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'linkedin-topcompanies/version'

Gem::Specification.new do |gem|
  gem.name          = "linkedin-topcompanies"
  gem.version       = Linkedin::Topcompanies::VERSION
  gem.authors       = ["Felipe Coury"]
  gem.email         = ["felipe.coury@gmail.com"]
  gem.homepage      = "http://gistia.com"
  gem.description   = %q{Given a keyword, an industry and a zipcode, retrieves top companies}
  gem.summary       = gem.summary

  gem.add_dependency "casperjs"                   , "~> 1.0.0"
  gem.add_development_dependency "rspec"          , "~> 2.6"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
